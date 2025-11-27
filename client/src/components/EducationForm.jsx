import { GraduationCap } from "lucide-react";
import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function EducationForm({ data, onChange }) {
  function addEducation(params) {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  }

  function removeEducation(index) {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  }

  function updateEducation(index, field, value) {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Education
          </h3>
          <p className="text-sm text-gray-500">Add your education details</p>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors "
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No education added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <div
              key={index}
              className="p-4 border mt-8 border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between">
                <h4>Education #{index + 1}</h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  onChange={(e) =>
                    updateEducation(index, "institution", e.target.value)
                  }
                  value={education.institution || ""}
                  type="text"
                  placeholder="Institution Name"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  value={education.degree || ""}
                  type="text"
                  placeholder="Degree"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  onChange={(e) =>
                    updateEducation(index, "field", e.target.value)
                  }
                  value={education.field || ""}
                  type="text"
                  placeholder="Field of study"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                <input
                  onChange={(e) =>
                    updateEducation(index, "graduation_date", e.target.value)
                  }
                  value={education.graduation_date || ""}
                  type="month"
                  placeholder=""
                  className="px-3 py-2 text-sm rounded-lg disabled:bg-gray-100"
                  disabled={education.is_current}
                />
                <input
                  onChange={(e) =>
                    updateEducation(index, "gpa", e.target.value)
                  }
                  value={education.gpa || ""}
                  type="text"
                  placeholder="(optional)"
                  className="px-3 py-2 text-sm rounded-lg disabled:bg-gray-100"
                  disabled={education.is_current}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
