"use client";

import React, { useState } from "react";
import styles from "../../examples/shared/page.module.css";
import Chat from "../../components/chat";
import ProjectManagerWidget from "../../components/project-manager-widget";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

interface ProjectDetails {
  goals: string;
  audience: string;
  timelines: string;
  requirements: string;
}

interface Task {
  task_id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  due_date: string;
}

interface ProjectData {
  projectDetails?: ProjectDetails;
  tasks?: Task[];
  projectName?: string;
  projectDescription?: string;
  projectSummary?: string;
  functionCalls?: { name: string; args: string }[];
}

const PrimaryProjectManager = () => {
  const [projectData, setProjectData] = useState<ProjectData>({});
  const isEmpty = Object.keys(projectData).length === 0 || (Object.keys(projectData).length === 1 && projectData.functionCalls);

  const handleAIResponse = (response: any) => {
    if (response.function_call) {
      const { name, arguments: args } = response.function_call;
      const parsedArgs = JSON.parse(args);

      switch (name) {
        case "generate_tasks":
          setProjectData(prevData => ({
            ...prevData,
            tasks: parsedArgs.tasks
          }));
          break;
        // Handle other function calls if needed
      }
    }
    // Handle other types of responses...
  };

  const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
    const { name, arguments: args } = call.function;
    const parsedArgs = JSON.parse(args);

    let newData: Partial<ProjectData> = {};

    switch (name) {
      case "generate_summary":
        if (!parsedArgs.project_details) {
          return "Error: project_details is required for generate_summary function";
        }
        newData = { projectDetails: parsedArgs.project_details };
        break;
      case "generate_tasks":
        console.log("generate_tasks");
        if (!parsedArgs.tasks || !Array.isArray(parsedArgs.tasks)) {
          return "Error: tasks array is required for generate_tasks function";
        }
        const projectName = projectData.projectName;
        const projectDescription = projectData.projectDescription;
        const projectSummary = projectData.projectDetails?.goals;
     
        if (!projectName || !projectDescription || !projectSummary) {
          return "Error: projectName, projectDescription, and project summary (goals) are required for generate_tasks function";
        }
     
        newData = {
          projectName: projectName,
          projectDescription: projectDescription,
          projectSummary: projectSummary,
          tasks: parsedArgs.tasks
        };
        
        setProjectData(prevData => ({
          ...prevData,
          ...newData
        }));
        
        return JSON.stringify(newData);
      case "review_tasks":
        if (!Array.isArray(parsedArgs.tasks)) {
          return "Error: tasks must be an array for review_tasks function";
        }
        newData = { tasks: parsedArgs.tasks };
        break;
      case "get_project_name":
        newData = {
          projectName: parsedArgs.project_name,
          projectDescription: parsedArgs.project_description
        };
        break;
      default:
        return "Function not implemented";
    }

    setProjectData(prevData => ({
      ...prevData,
      ...newData,
      functionCalls: [
        ...(prevData.functionCalls || []),
        { name, args: JSON.stringify(parsedArgs, null, 2) }
      ]
    }));
    return JSON.stringify(newData);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.column}>
          <ProjectManagerWidget
            projectData={projectData}
            isEmpty={isEmpty}
            reviewedTasks={projectData.review?.tasks}
          />
        </div>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat functionCallHandler={functionCallHandler} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrimaryProjectManager;
