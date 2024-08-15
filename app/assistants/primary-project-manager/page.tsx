"use client";

import React, { useState } from "react";
import styles from "../../examples/shared/page.module.css";
import Chat from "../../components/chat";
import ProjectManagerWidget from "../../components/project-manager-widget";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

interface ProjectData {
  summary?: string;
  tasks?: string[];
  review?: string;
  confirmation?: string;
}

const PrimaryProjectManager = () => {
  const [projectData, setProjectData] = useState<ProjectData>({});
  const isEmpty = Object.keys(projectData).length === 0;

  const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
    const { name, arguments: args } = call.function;
    const parsedArgs = JSON.parse(args);

    let data: ProjectData = {};

    switch (name) {
      case "generate_summary":
        data = {
          summary: parsedArgs.summary,
        };
        break;
      case "generate_tasks":
        data = {
          tasks: parsedArgs.tasks,
        };
        break;
      case "review_tasks":
        data = {
          review: parsedArgs.review,
        };
        break;
      case "confirm_tasks":
        data = {
          confirmation: parsedArgs.confirmation,
        };
        break;
      default:
        return "Function not implemented";
    }

    setProjectData(data);
    return JSON.stringify(data);
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
