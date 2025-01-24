import React from "react";

export const MaximizeIcon = ({
  fill,
  className,
}: {
  fill: string;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className={className}
  >
    <path fill="none" stroke={fill} strokeWidth="2" d="M3 3h18v18H3z" />
    <path
      stroke={fill}
      strokeWidth="2"
      d="M7 7l-4 4m16-4l-4 4m4 8l-4-4m-16 4l4-4"
    />
  </svg>
);

export const MinimizeIcon = ({
  fill,
  className,
}: {
  fill: string;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className={className}
  >
    <path fill="none" stroke={fill} strokeWidth="2" d="M3 3h18v18H3z" />
    <path stroke={fill} strokeWidth="2" d="M5 12h14" />
  </svg>
);

export const StackOfChipsIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M2 5.25a3.25 3.25 0 013.25-3.25H18.5A3.25 3.25 0 0121.75 5.25v13.5a3.25 3.25 0 01-3.25 3.25H5.25A3.25 3.25 0 012 18.75V5.25zM5.25 3a1.75 1.75 0 00-1.75 1.75v13.5c0 .966.784 1.75 1.75 1.75H18.5a1.75 1.75 0 001.75-1.75V5.25A1.75 1.75 0 0018.5 3H5.25z" />
    <path d="M4 7a2 2 0 012-2h12a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7zm2-1a1 1 0 00-1 1v11a1 1 0 001 1h12a1 1 0 001-1V7a1 1 0 00-1-1H6z" />
  </svg>
);

export const LeftArrowIcon = ({
  fill,
  className,
}: {
  fill: string;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z"
      clipRule="evenodd"
    />
  </svg>
);

export const RightArrowIcon = ({
  fill,
  className,
}: {
  fill: string;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zm2.78 9.22a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06-1.06l-1.72-1.72H8.25a.75.75 0 000-1.5h5.69l-1.72-1.72a.75.75 0 101.06-1.06l3 3z"
      clipRule="evenodd"
    />
  </svg>
);
