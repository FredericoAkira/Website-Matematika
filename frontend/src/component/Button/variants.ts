import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded border font-bold focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed transition ease-out duration-200",
  {
    variants: {
      variant: {
        ghost:
          "text-neutral-default hover:!text-white bg-neutral-text hover:!bg-[#0291E5] border-0 focus-visible:ring-primary-100 focus-visible:border-0 focus-visible:bg-neutral-bg disabled:text-gray-300 disabled:border-0 disabled:hover:!bg-gray-500 disabled:hover:!text-gray-500 disabled:hover:!border-0",
        default:
          "text-white bg-[#0291E5] hover:cursor-pointer hover:bg-primary-600 border-[#0291E5] focus-visible:ring-primary-100 focus-visible:bg-primary-600 disabled:bg-gray-500 disabled:border-gray-500",
        outline:
          "text-neutral-default hover:!text-white bg-neutral-text hover:!bg-[#0291E5] border-[#0291E5] focus-visible:ring-primary-100 focus-visible:border-[#0291E5] focus-visible:bg-neutral-bg disabled:text-gray-500 disabled:border-gray-500 disabled:bg-gray-200/50 disabled:hover:!bg-white disabled:hover:!text-gray-500 disabled:hover:!border-gray-500",
        comma: "hovering:bg-none border-none",
      },
      size: {
        default: "text-xs py-1.5 px-4 gap-2",
        lg: "text-sm py-3 px-4 gap-3",
        xl: "text-sm py-4 px-6 gap-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
