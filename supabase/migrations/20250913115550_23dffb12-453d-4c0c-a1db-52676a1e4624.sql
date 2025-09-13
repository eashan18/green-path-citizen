-- Add RLS policy to allow committee/ULB to update report status
CREATE POLICY "Committee and ULB can update report status" 
ON public.reports 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('committee', 'ulb')
  )
);