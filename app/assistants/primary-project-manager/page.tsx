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

interface ProjectData {
  projectDetails?: ProjectDetails;
  tasks?: {
    project_summary: string;
    tasks: string[];
  } | null;
  review?: {
    tasks: {
      task_id: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      due_date: string;
    }[];
  };
  confirmation?: {
    confirmed_tasks: {
      task_id: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      due_date: string;
    }[];
  };
  projectName?: string;
  projectDescription?: string;
  functionCalls?: { name: string; args: string }[];
}

const PrimaryProjectManager = () => {
  const [projectData, setProjectData] = useState<ProjectData>({});
  const isEmpty = Object.keys(projectData).length === 0 || (Object.keys(projectData).length === 1 && projectData.functionCalls);

  const handleAIResponse = (response: any) => {
    if (response.function_call && response.function_call.name === "generate_tasks") {
      const generatedTasks = JSON.parse(response.function_call.arguments);
      setProjectData(prevData => ({
        ...prevData,
        tasks: {
          project_summary: generatedTasks.project_summary,
          tasks: generatedTasks.tasks
        }
      }));
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
        if (!parsedArgs.project_summary) {
          return "Error: project_summary is required for generate_tasks function";
        }
        const projectName = projectData.projectName;
        const projectDescription = projectData.projectDescription;
     
        if (!projectName || !projectDescription) {
          return "Error: projectName and projectDescription are required for generate_tasks function";
        }
     
        // Return the information needed for the AI to generate tasks
        return JSON.stringify({
          project_name: projectName,
          project_description: projectDescription,
          project_summary: parsedArgs.project_summary
        });
      case "review_tasks":
        if (!Array.isArray(parsedArgs.tasks)) {
          return "Error: tasks must be an array for review_tasks function";
        }
        newData = { review: { tasks: parsedArgs.tasks } };
        break;
      case "confirm_tasks":
        if (!Array.isArray(parsedArgs.confirmed_tasks)) {
          return "Error: confirmed_tasks must be an array for confirm_tasks function";
        }
        // Validate the structure of each task
        for (const task of parsedArgs.confirmed_tasks) {
          if (!task.task_id || !task.description || !task.priority || !task.due_date) {
            return "Error: Each task must have task_id, description, priority, and due_date";
          }
          if (!['high', 'medium', 'low'].includes(task.priority)) {
            return "Error: Task priority must be 'high', 'medium', or 'low'";
          }
        }
        newData = { confirmation: { confirmed_tasks: parsedArgs.confirmed_tasks } };
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
