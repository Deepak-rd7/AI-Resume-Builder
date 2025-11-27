//controller for creating a new resume
//POST:/api/resumes/create

import { log } from "console";
import imagekit from "../config/imageKit.js";
import Resume from "../models/ResumeModel.js";
import fs from "fs";

export async function createResume(req, res) {
  try {
    const userId = req.userId;
    const { title } = req.body;

    //create new resume
    const newResume = await Resume.create({ userId, title });

    //return success message
    return res.status(201).json({
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

//controller for deleting resume
//DELETE:/api/resumes/delete

export async function deleteResume(req, res) {
  const userId = req.userId;
  const { resumeId } = req.params;

  await Resume.findOneAndDelete({ userId, _id: resumeId });

  //return success message
  return res.status(201).json({
    message: "Resume deleted successfully",
  });
}

//get useer resume by id
//GET: /api/resumes/get
export async function getResumeById(req, res) {
  const userId = req.userId;
  const { resumeId } = req.params;

  try {
    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(201).json({
      resume,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

//get resume by id public
//GET: /api/resumes/public
export async function getPublicResumeById(req, res) {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

//controller for updating a resume
//PUT: /api/resumes/update

export async function updateResume(req, res) {
  try {
    const userId = req.userId;

    const { resumeId, resumeData, removeBackground } = req.body;
 
    
    const image = req.file;

    let resumeDataCopy;  
    if(typeof resumeData === 'string'){
      resumeDataCopy=JSON.parse(resumeData);
    }else{
      resumeDataCopy=structuredClone(resumeData)
    }
    
    
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);

     

      const response = await imagekit.files.upload({
        file: fs.createReadStream(image.path),
        fileName: "resume.png",
        folder:'user-resumes',
        transformation:{
            pre:'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremove':'')
        }
      });
      

      resumeDataCopy.personal_info.image=response.url
      
    }

    const resume = await Resume.findByIdAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      {
        new: true,
      }
    );

    return res.status(200).json({
      resume,
      message: "Saved Successfully",
    });
  } catch (error) {
     console.log(error.message);
    return res.status(400).json({
      message: error.message,
    });
  
   
    
  }
}
