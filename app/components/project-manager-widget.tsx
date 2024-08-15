import React from 'react';
import styles from './project-manager-widget.module.css';

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

interface ProjectManagerWidgetProps {
  projectData: ProjectData;
  isEmpty: boolean;
}

const ProjectManagerWidget: React.FC<ProjectManagerWidgetProps> = ({ projectData, isEmpty }) => {
  if (isEmpty) {
    return (
      <div className={styles.widget}>
        <h2>Project Manager Assistant</h2>
        <ul>
          <li>Create and manage tasks</li>
          <li>Update project statuses</li>
          <li>Check team availability</li>
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      <h2>Project Information</h2>
      {projectData.taskId && (
        <div>
          <h3>Task Created</h3>
          <p>ID: {projectData.taskId}</p>
          <p>Title: {projectData.title}</p>
          <p>Description: {projectData.description}</p>
          <p>Assignee: {projectData.assignee}</p>
          <p>Status: {projectData.status}</p>
        </div>
      )}
      {projectData.projectId && (
        <div>
          <h3>Project Status Updated</h3>
          <p>Project ID: {projectData.projectId}</p>
          <p>New Status: {projectData.status}</p>
          <p>Update Time: {projectData.updateTime}</p>
        </div>
      )}
      {projectData.teamId && (
        <div>
          <h3>Team Availability</h3>
          <p>Team ID: {projectData.teamId}</p>
          <p>Date: {projectData.date}</p>
          <p>Available: {projectData.availableMembers?.join(', ')}</p>
          <p>Unavailable: {projectData.unavailableMembers?.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectManagerWidget;
