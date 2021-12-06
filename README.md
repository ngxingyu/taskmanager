# Level 1: Make a plan

### User requirements

- Task management web application to create, categorize, store tasks
- CRUD operations for tasks
  - Users own multiple "projects"
  - Each project has multiple owners (able to edit permissions) / editors / viewers
  - Each project contains tasks, subtasks, subsubtasks etc.
  - User has ability to retrieve all sub**tasks of any project they have access to.
  - REST API endpoint for each CRUD operation
- Tagging system to categorize tasks
- Features to improve user experience

### Use cases:

- Individual tasks for user
  - Create an account (username and email and password) <User: id 0, name "user", email "..." ...>
    - Or login to existing account
    - Required for all endpoints except the login page.
  - Create a project (default owner is user) <Project: id 0, name 'My Tasks'>
    - Set user as owner of project: <ProjectUser: id 0, project_id 0, user_id 0, type: owner>
    - On account creation, My Tasks project created by default.
  - Create a task: <Task: id 0, project_id 0, title, notes, expected duration, deadline, importance, status todo, tags, level 0, parent: nil, ...>
  - Create a subtask: <Task: id 1, project_id 0, title, notes, expected duration, deadline, importance, status todo, tags, level 1, parent: Task 0, ...>
  - User can create a subtask for any existing task or create a root level 0 task.
  - Deleting a task will delete all of its subtasks.
  - User can add tags which will be associated to a single project id. This is handled in the creation or modification of tasks.
- For teams:
  - Each user creates account
  - User creates a project
  - User adds other users to project
  - Any user can create tasks subtasks etc.
- Ability to filter for tasks by tags
- View task lists up to 1 level deep. 
- Optional: Ability to perform search by task title / notes (full text search?)
- Optional: Pagination
- Optional: Kanban visualisation for status (todo, in progress, completed)

## Intended implementation details:

- Rails backend with React frontend

### Data

- User table for user accounts
- Project table for projects
- Tasks table for tasks/subtasks etc.
- Intermediate table for Users for each project
- Intermediate table for Tags for each project

![](https://raw.githubusercontent.com/ngxingyu/taskmanager/main/taskmanager-backend/ERD.svg?token=ADAYHMH2XB4BETFDVZG7UZTBW36T4)
