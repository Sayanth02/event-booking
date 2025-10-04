// CardContainer.tsx
import React from "react";

interface CardContainerProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  borderColor?: string;
  bgColor?: string;
}

const resolveColor = (color?: string) => {
  if (!color) return undefined;
  const arbitraryMatch = color.match(/^\[(.*)\]$/);
  return arbitraryMatch ? arbitraryMatch[1] : color;
};

export const CardContainer: React.FC<CardContainerProps> = ({
  title,
  children,
  subtitle,
  borderColor = "#3b82f6",
  bgColor = "bg-white",
}) => {
  const resolvedBorderColor = resolveColor(borderColor);

  return (
    <div
      className={`${bgColor} rounded-lg shadow-md p-6 border-l-4`}
      style={{ borderLeftColor: resolvedBorderColor }}
    >
      {title && (
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 flex items-center">
            <span
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: resolvedBorderColor }}
            ></span>
            {title}
          </h3>
          {subtitle && (
            <p className="text-[14px] text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
