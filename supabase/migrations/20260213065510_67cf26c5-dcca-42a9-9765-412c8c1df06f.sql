
ALTER TABLE public.companies ADD COLUMN gradient_color_1 text;
ALTER TABLE public.companies ADD COLUMN gradient_color_2 text;
ALTER TABLE public.companies ADD COLUMN gradient_angle integer DEFAULT 180;
ALTER TABLE public.companies ADD COLUMN button_gradient_color_1 text;
ALTER TABLE public.companies ADD COLUMN button_gradient_color_2 text;
ALTER TABLE public.companies ADD COLUMN button_gradient_angle integer DEFAULT 90;
