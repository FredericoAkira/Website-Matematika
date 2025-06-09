import { cva } from "class-variance-authority";

export const badgeVariants = cva("inline-flex items-center rounded-full", {
  variants: {
    size: {
      default: "text-[12px] py-0.5 px-2 gap-1",
      md: "text-xs py-0.5 px-2.5 gap-1.5",
      lg: "text-xs py-1 px-3 gap-2",
    },
    variant: {
      default: "bg-gray-300 text-neutral-default",
      danger: "bg-[#FBEAEA] text-[#962222]",
      warning: "bg-[#FFFFE3] text-[#8B8000]",
      success: "bg-[#EDFAEF] text-[#359443]",
      successTable: "bg-green-200/50 text-green-600"
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});
