"use client";

import React, { useState } from "react";
import styles from "../../examples/shared/page.module.css";
import Chat from "../../components/chat";
import ProjectManagerWidget from "../../components/project-manager-widget";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

interface ProjectData {
  taskId?: number;
  title?: string;
  description?: string;
  assignee?: string;
  status?: string;
  projectId?: string;
  updateTime?: string;
  teamId?: string;
  date?: string;
  availableMembers?: string[];
  unavailableMembers?: string[];
}

const PrimaryProjectManager = () => {
  const [projectData, setProjectData] = useState<ProjectData>({});
  const isEmpty = Object.keys(projectData).length === 0;

  const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
    const { name, arguments: args } = call.function;
    const parsedArgs = JSON.parse(args);

    let data: ProjectData = {};

    switch (name) {
      case "create_task":
        const { title, description, assignee } = parsedArgs;
        data = {
          taskId: Math.floor(Math.random() * 1000),
          title,
          description,
          assignee,
          status: "Created",
        };
        break;
      case "update_project_status":
        const { projectId, status } = parsedArgs;
        data = {
          projectId,
          status,
          updateTime: new Date().toISOString(),
        };
        break;
      case "get_team_availability":
        const { teamId, date } = parsedArgs;
        data = {
          teamId,
          date,
          availableMembers: ["Alice", "Bob", "Charlie"],
          unavailableMembers: ["David", "Eve"],
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
