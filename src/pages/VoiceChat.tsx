import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mic, MicOff, Send, Volume2, VolumeX, MessageSquare, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const VoiceChat = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant for waste management. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await processAudioInput(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    try {
      // Convert audio to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        // Send to speech-to-text service
        const { data: transcriptData, error: transcriptError } = await supabase.functions
          .invoke('speech-to-text', {
            body: { audio: base64Audio }
          });

        if (transcriptError) throw transcriptError;

        const userText = transcriptData.text;
        
        // Add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          text: userText,
          sender: 'user',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        // Get AI response
        await getAIResponse(userText);
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Error",
        description: "Failed to process audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getAIResponse = async (userText: string) => {
    try {
      const { data, error } = await supabase.functions
        .invoke('ai-chat', {
          body: { 
            message: userText,
            context: 'waste_management'
          }
        });

      if (error) throw error;

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: data.response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Convert response to speech
      await playAIResponse(data.response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const playAIResponse = async (text: string) => {
    try {
      const { data, error } = await supabase.functions
        .invoke('text-to-speech', {
          body: { 
            text: text,
            voice: 'alloy'
          }
        });

      if (error) throw error;

      // Play the audio
      const audioBlob = new Blob([
        Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
      ], { type: 'audio/mp3' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
      
      await audioRef.current.play();
    } catch (error) {
      console.error('Error playing AI response:', error);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setTextInput('');
    
    await getAIResponse(textInput);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <DashboardLayout userType="citizen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="gradient-primary rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">AI Voice Assistant</h1>
          <p className="opacity-90">
            Ask questions about waste management, get guidance, or report issues using voice or text.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Voice Controls */}
          <Card className="shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Voice Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-24 h-24 rounded-full ${
                    isRecording 
                      ? 'bg-destructive hover:bg-destructive/90 animate-pulse' 
                      : 'gradient-primary'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={isPlaying ? stopAudio : undefined}
                  disabled={!isPlaying}
                  className="w-full"
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="h-4 w-4 mr-2" />
                      Stop Audio
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4 mr-2" />
                      No Audio Playing
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="lg:col-span-2 shadow-medium border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-muted rounded-lg">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'gradient-primary text-white'
                          : 'bg-white border'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Text Input */}
              <form onSubmit={handleTextSubmit} className="flex gap-2">
                <Input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!textInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle>Quick Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                'How do I segregate waste properly?',
                'Where can I report illegal dumping?',
                'What items can be recycled?',
                'How to start composting at home?',
                'Schedule waste pickup',
                'Find nearest recycling center'
              ].map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  onClick={() => getAIResponse(question)}
                  className="text-left justify-start h-auto p-3"
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VoiceChat;