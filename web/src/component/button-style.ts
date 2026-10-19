export type ButtonVariant = "primary" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-button text-center font-button font-semibold cursor-pointer transition duration-150 hover:brightness-110 active:translate-y-0.75 active:brightness-95";

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-12 px-4 text-base",
  lg: "h-14 px-6 text-lg",
};

const variants: Record<ButtonVariant, string> = {
  primary: "border border-primary border-b-0 text-black bg-primary",
  danger: "bg-danger text-danger-text",
};

export const buttonClassName = (
  variant: ButtonVariant,
  size: ButtonSize = "md",
): string => `${base} ${sizes[size]} ${variants[variant]}`;
