import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ActionChoice } from "../../types";
import { Button } from "@/components/ui/button";
import { useLongPress } from "../../hooks/useLongPress";
import { ClassificationPicker } from "./ClassificationPicker";

interface ActionButtonsProps {
  leftAction: ActionChoice;
  rightAction: ActionChoice;
  onLeftClick: () => void;
  onRightClick: () => void;
  onClassificationSelect?: (
    position: "left" | "right",
    classification: string
  ) => void;
  disabled?: boolean;
  alternativeClassifications?: string[];
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  leftAction,
  rightAction,
  onLeftClick,
  onRightClick,
  onClassificationSelect,
  disabled,
  alternativeClassifications = [],
}) => {
  const [pickerOpen, setPickerOpen] = useState<"left" | "right" | null>(null);

  // If no alternative classifications provided, use the default actions
  const classificationOptions =
    alternativeClassifications.length > 0
      ? alternativeClassifications
      : [leftAction.label, rightAction.label];

  const leftLongPressHandlers = useLongPress({
    onClick: onLeftClick,
    onLongPress: () => setPickerOpen("left"),
    disabled: disabled || !onClassificationSelect,
  });

  const rightLongPressHandlers = useLongPress({
    onClick: onRightClick,
    onLongPress: () => setPickerOpen("right"),
    disabled: disabled || !onClassificationSelect,
  });

  const handleClassificationSelect = (classification: string) => {
    if (onClassificationSelect && pickerOpen) {
      onClassificationSelect(pickerOpen, classification);
    }
    setPickerOpen(null);
  };

  return (
    <>
      <div className="absolute bottom-0 pb-4 left-0 right-0 px-4 flex justify-between bg-gradient-to-t from-black/20 to-transparent items-center">
        {/* Left Action Button */}
        <Button
          disabled={disabled}
          size="lg"
          variant="ghost"
          className={`relative bg-gradient-to-br rounded-full from-red-500/5 via-transparent to-red-500/40 border border-white/10 backdrop-blur-sm hover:bg-red-500/40 text-white hover:text-white font-medium tracking-wide shadow-md overflow-hidden transition-all duration-300 ${
            onClassificationSelect ? "active:scale-95" : ""
          }`}
          {...leftLongPressHandlers}
        >
          <ChevronLeft className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6" />
          <span className="ml-8">{leftAction.label}</span>
          <span className="absolute inset-0 rounded-full pointer-events-none opacity-0 hover:opacity-10 bg-white" />
          <span
            className="absolute inset-0 bg-white transform scale-0 rounded-full pointer-events-none duration-500 ease-out"
            style={{ animation: "pulse-glow 1s ease-out infinite" }}
          />
        </Button>

        {/* Right Action Button */}
        <Button
          disabled={disabled}
          size="lg"
          variant="ghost"
          className={`relative bg-gradient-to-bl rounded-full from-yellow-500/5 via-transparent to-yellow-500/40 border border-white/10 backdrop-blur-sm hover:bg-yellow-500/40 text-white hover:text-white font-medium tracking-wide shadow-md overflow-hidden transition-all duration-300 ${
            onClassificationSelect ? "active:scale-95" : ""
          }`}
          {...rightLongPressHandlers}
        >
          <span className="mr-8">{rightAction.label}</span>
          <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6" />
          <span className="absolute inset-0 rounded-full pointer-events-none opacity-0 hover:opacity-10 bg-white" />
          <span
            className="absolute inset-0 bg-white transform scale-0 rounded-full pointer-events-none duration-500 ease-out"
            style={{ animation: "pulse-glow 1s ease-out infinite" }}
          />
        </Button>
      </div>

      {/* Classification Picker Modal */}
      <ClassificationPicker
        isOpen={pickerOpen !== null}
        onClose={() => setPickerOpen(null)}
        initialValue={
          pickerOpen === "left" ? leftAction.label : rightAction.label
        }
        options={classificationOptions}
        onSelect={handleClassificationSelect}
        position={pickerOpen || "left"}
      />
    </>
  );
};
