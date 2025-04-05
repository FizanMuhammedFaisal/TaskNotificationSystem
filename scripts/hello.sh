#!/bin/bash

# Display a heading
echo "📝 Task Scheduler - Add a New Task"

# Prompt user for input
read -p "Enter task title: " title
read -p "Enter task description (optional): " description
read -p "Enter due date (YYYY-MM-DD HH:MM): " due_date

# Convert the due date to a UNIX timestamp
due_timestamp=$(date -j -f "%Y-%m-%d %H:%M" "$due_date" "+%s" 2>/dev/null)


# Check if the date conversion was successful
if [ $? -ne 0 ]; then
    echo "❌ Error: Invalid date format."
    exit 1
fi

# Call the Node.js gRPC client
node "$(dirname "$0")/../apps/task-client/index.js" "$title" "$description" "$due_timestamp"

# Check if the Node.js script was successful
if [ $? -eq 0 ]; then
    echo "✅ Task added successfully!"
else
    echo "❌ Failed to add task."
fi
