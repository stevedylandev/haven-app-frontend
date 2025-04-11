import React, { useEffect, useState } from "react";
import Picker from "react-mobile-picker";
import { X } from "lucide-react";
import { Action } from "@/types";

interface ClassificationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  initialValue: string;
  options: Action[];
  onSelect: (value: string) => void;
  position: "left" | "right";
}

export const ClassificationPicker: React.FC<ClassificationPickerProps> = ({
  isOpen,
  onClose,
  initialValue,
  options,
  onSelect,
  position,
}) => {
  const [selectedValue, setSelectedValue] = useState({
    classification: initialValue,
  });

  // Reset to initial value when opening
  useEffect(() => {
    if (isOpen) {
      setSelectedValue({ classification: initialValue });
    }
  }, [isOpen, initialValue]);

  const handleSelect = () => {
    onSelect(selectedValue.classification);
    onClose();
  };

  if (!isOpen) return null;

  // Create a fallback if options is not an array or empty
  const displayOptions =
    Array.isArray(options) && options.length > 0
      ? options
      : [
          {
            action_id: 0,
            action_name: initialValue,
            description: null,
            created_at: new Date().toISOString(),
          },
        ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-gray-800/90 w-full max-w-md rounded-t-2xl shadow-2xl border border-gray-700/50 transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
          <h2 className="text-white font-medium">
            Alternative Classifications{" "}
            {options.length > 0 ? `(${options.length})` : "(No options)"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-center">
            <div className="px-4 w-full">
              <div className="relative">
                <div className="picker-container text-white">
                  <Picker
                    value={selectedValue}
                    onChange={setSelectedValue}
                    height={200}
                    itemHeight={40}
                    wheelMode="natural"
                  >
                    <Picker.Column name="classification">
                      {displayOptions.map((option) => (
                        <Picker.Item
                          key={option.action_id}
                          value={option.action_name}
                        >
                          {({ selected }) => (
                            <div
                              className={`py-2 px-4 ${
                                selected
                                  ? "font-bold text-white"
                                  : "text-gray-400"
                              }`}
                            >
                              {option.action_name}
                            </div>
                          )}
                        </Picker.Item>
                      ))}
                    </Picker.Column>
                  </Picker>
                </div>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="h-[40px] w-full bg-white/10 border-y border-white/20 rounded" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSelect}
            className={`mt-4 w-full py-3 rounded-full font-medium text-white focus:outline-none transition-colors duration-300 ${
              position === "left"
                ? "bg-gradient-to-br from-red-500/80 via-red-500/70 to-red-500/90 hover:from-red-500/90 hover:to-red-500"
                : "bg-gradient-to-br from-yellow-500/80 via-yellow-500/70 to-yellow-500/90 hover:from-yellow-500/90 hover:to-yellow-500"
            }`}
          >
            Select Classification
          </button>
        </div>
      </div>
    </div>
  );
};
