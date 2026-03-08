"use client";

import { Wrench } from "lucide-react";

const SuggestedFixesList: React.FC<{
  title: string;
  fixes: string[];
}> = ({ title, fixes }) => {
  if (!fixes || fixes.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 bg-emerald-50 border border-emerald-200">
      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
        <Wrench className="w-4 h-4 text-emerald-600" />
        {title}
      </h4>
      <ul className="space-y-1">
        {fixes.map((fix, index) => (
          <li key={index} className="flex items-start text-sm text-gray-700">
            <span className="mr-2 text-emerald-600 shrink-0">•</span>
            {fix}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedFixesList;
