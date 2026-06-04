-- Add payment tracking fields to the admission_form table
ALTER TABLE public.admission_form 
ADD COLUMN payment_status varchar DEFAULT 'pending',
ADD COLUMN payment_id varchar;
