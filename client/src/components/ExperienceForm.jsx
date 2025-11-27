import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../configs/api";

export default function ExperienceForm({ data, onChange }) {


  const {token}=useSelector(state=>state.auth);
  const [generatingIndex,setGeneratingIndex]=useState(-1);


  function addExperience(params) {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  }

  function removeExperience(index) {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  }

  function updateExperience(index, field, value) {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }


  async function generateDescription(index) {
    setGeneratingIndex(index);

    const experience=data[index];

    
    const prompt=`enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}.`

    try {
      const {data}=await api.post('/api/ai/enhance-job-desc',{userContent:prompt},{
        headers:{
          Authorization:token
        }
      }
        
      )
      updateExperience(index,"description",data.enhancedContent)
    } catch (error) {
      toast.error(error.message)
    }finally{
      setGeneratingIndex(-1);
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              Professional Experience
            </h3>
            <p className="text-sm text-gray-500">Add your job experience</p>
          </div>
          <button
            onClick={addExperience}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors "
          >
            <Plus className="size-4" />
            Add Experience
          </button>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No work experience added yet.</p>
            <p className="text-sm">Click "Add Experience" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((experience, index) => (
              <div
                key={index}
                className="p-4 border mt-8 border-gray-200 rounded-lg space-y-3"
              >
                <div className="flex justify-between">
                        <h4>Experience #{index + 1}</h4>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    onChange={(e) =>
                      updateExperience(index, "company", e.target.value)
                    }
                    value={experience.company || ""}
                    type="text"
                    placeholder="Company Name"
                    className="px-3 py-2 text-sm rounded-lg"
                  />
                  <input
                    onChange={(e) =>
                      updateExperience(index, "position", e.target.value)
                    }
                    value={experience.position || ""}
                    type="text"
                    placeholder="Job Title"
                    className="px-3 py-2 text-sm rounded-lg"
                  />
                  <input
                    onChange={(e) =>
                      updateExperience(index, "start_date", e.target.value)
                    }
                    value={experience.start_date || ""}
                    type="text"
                    placeholder="start-date"
                    className="px-3 py-2 text-sm rounded-lg"
                  />
                  <input
                    onChange={(e) =>
                      updateExperience(index, "end_date", e.target.value)
                    }
                    value={experience.end_date || ""}
                    type="text"
                    placeholder="end-date"
                    className="px-3 py-2 text-sm rounded-lg disabled:bg-gray-100"
                    disabled={experience.is_current}
                  />
                </div>

                <label>
                  <input
                    type="checkbox"
                    checked={experience.is_current || false}
                    onChange={(e) =>
                      updateExperience(
                        index,
                        "is_current",
                        e.target.checked ? true : false
                      )
                    }
                  />
                  <span className="text-sm text-gray-700">
                    Currently working here
                  </span>
                </label>

                <div className="space-y-2">
                  <div className=" flex items-center justify-between">
                    <label>Job Description</label>
                    <button onClick={()=>generateDescription(index)} disabled={generatingIndex === index || !experience.position || !experience.company} className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50">
                     {generatingIndex===index?(<Loader2 className="w-3 h-3 animate-spin"/>):(<Sparkles className="w-3 h-3" />)} 
                      Enhance with AI
                    </button>
                  </div>

                  <textarea value={experience.description||""} onChange={(e)=>updateExperience(index,"description",e.target.value)} className="w-full text-sm px-3 py-3 rounded-lg resize-none" placeholder="Describe your key responsibiies and achievements..." name="" id=""></textarea>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
