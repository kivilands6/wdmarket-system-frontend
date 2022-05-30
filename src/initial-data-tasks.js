const initialDataTasks = [
    {
        id: 'Column-1',
        title: ' 📃 Backlog tasks',
        color: 'red',
        tasks: [
            {
                id: "Task 1",
                title: 'Learn JavaScript',
                priority: 'Very High',
                project: 'Amarina',
                content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
            {
                id: "Task 2",
                title: 'Learn Git',
                priority: 'High',
                project: 'LYL'
            },
            {
                id: "Task 3",
                title: 'Learn Python',
                priority: 'Medium',
                project: 'Sportx'
            },
        ]
    },
    {
        id: 'Column-2',
        title: ' ✏️ To Do',
        color: 'yellow',
        tasks: [
            {
                id: "Task 4",
                title: 'Learn CSS',
                priority: 'Low',
                project: 'Amarina'
            },
            {
                id: "Task 5",
                title: 'Learn Golang',
                priority: 'Very Low',
                project: 'feelgreen'
            }
        ]
    },
    {
        id: 'Column-3',
        title: ' ✔️ In Progress',
        color: 'green',
        tasks: [
            {
                id: "Task 6",
                title: 'Learn HTML',
                priority: 'High',
                project: 'Adamo'
            }
        ]
    },
    {
        id: 'Column-4',
        title: ' ✔️ Testing',
        color: 'blue',
        tasks: []
    },
    {
        id: 'Column-5',
        title: ' ✔️ Done',
        color: 'purple',
        tasks: []
    }
]

export default initialDataTasks;