#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { TodoistApi } from "@doist/todoist-api-typescript";

// Define tools
const CREATE_TASK_TOOL: Tool = {
  name: "todoist_create_task",
  description: "Create a new task in your Todoist with full customization options. Define the task's title, add detailed descriptions, set due dates using natural language (like \"tomorrow at 2pm\" or \"next Monday\"), and assign priority levels from 1 (normal) to 4 (urgent). Perfect for quickly capturing and organizing new responsibilities with proper context and timing.",
  inputSchema: /* same as before */ {
    type: "object",
    properties: {
      content: {
        type: "string",
        description: "The content/title of the task"
      },
      description: {
        type: "string",
        description: "Detailed description of the task (optional)"
      },
      due_string: {
        type: "string",
        description: "Natural language due date like 'tomorrow', 'next Monday', 'Jan 23' (optional)"
      },
      priority: {
        type: "number",
        description: "Task priority from 1 (normal) to 4 (urgent) (optional)",
        enum: [1, 2, 3, 4]
      }
    },
    required: ["content"]
  }
};

const GET_TASKS_TOOL: Tool = {
  name: "todoist_get_tasks",
  description: "Retrieve and filter your Todoist tasks using powerful search capabilities. View tasks by due date (\"today\", \"next week\"), priority levels, or custom filters. Supports natural language queries like \"high priority tasks due this week\" or \"overdue tasks\". Use the limit parameter to control how many tasks are returned. Essential for getting an organized view of your pending work.",
  inputSchema: /* same as before */ {
    type: "object",
    properties: {
      project_id: {
        type: "string",
        description: "Filter tasks by project ID (optional)"
      },
      filter: {
        type: "string",
        description: "Natural language filter like 'today', 'tomorrow', 'next week', 'priority 1', 'overdue' (optional)"
      },
      priority: {
        type: "number",
        description: "Filter by priority level (1-4) (optional)",
        enum: [1, 2, 3, 4]
      },
      limit: {
        type: "number",
        description: "Maximum number of tasks to return (optional)",
        default: 10
      }
    }
  }
};

const UPDATE_TASK_TOOL: Tool = {
  name: "todoist_update_task",
  description: "Modify existing tasks by searching for their names and updating any of their attributes. The tool finds the most relevant task matching your search term and allows you to change its title, description, due date, or priority level. Ideal for rescheduling tasks, adjusting priorities, or adding more details as plans change. Uses fuzzy matching so you don't need to remember exact task names.",
  inputSchema: /* same as before */ {
    type: "object",
    properties: {
      task_name: {
        type: "string",
        description: "Name/content of the task to search for and update"
      },
      content: {
        type: "string",
        description: "New content/title for the task (optional)"
      },
      description: {
        type: "string",
        description: "New description for the task (optional)"
      },
      due_string: {
        type: "string",
        description: "New due date in natural language like 'tomorrow', 'next Monday' (optional)"
      },
      priority: {
        type: "number",
        description: "New priority level from 1 (normal) to 4 (urgent) (optional)",
        enum: [1, 2, 3, 4]
      }
    },
    required: ["task_name"]
  }
};

const DELETE_TASK_TOOL: Tool = {
  name: "todoist_delete_task",
  description: "Permanently remove tasks from your Todoist by searching for their names. Uses intelligent matching to find the right task based on your search term. This action cannot be undone, so the tool will confirm the exact task to be deleted before proceeding. Useful for removing obsolete or cancelled tasks from your task list.",
  inputSchema: /* same as before */ {
    type: "object",
    properties: {
      task_name: {
        type: "string",
        description: "Name/content of the task to search for and delete"
      }
    },
    required: ["task_name"]
  }
};

const COMPLETE_TASK_TOOL: Tool = {
  name: "todoist_complete_task",
  description: "Mark tasks as completed by searching for their names. The tool uses smart matching to find the most relevant task - you don't need the exact name, just enough to identify it uniquely. Once found, the task will be marked as complete and moved to your completed tasks history. Perfect for quickly checking off finished items from your list.",
  inputSchema: /* same as before */ {
    type: "object",
    properties: {
      task_name: {
        type: "string",
        description: "Name/content of the task to search for and complete"
      }
    },
    required: ["task_name"]
  }
};
