const initialData = {
    tasks: {
        'task-1': { id: 'task-1', title: 'Cahnge color', project: 'Adamo', content: 'Change the color of the div', priority: '1' },
        'task-2': { id: 'task-2', title: 'Maket changes',project: 'Amamrina', content: 'Change the style', priority: '2' },
        'task-3': { id: 'task-3', title: 'Api implementation',project: 'LYL', content: 'Connect to api', priority: '3' },
        'task-4': { id: 'task-4', title: 'Bug fix',project: 'z/s ligo', content: 'Fix the problem on mobile devices', priority: '2' },
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'To do',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
        },
    },
    // for future
    columnOrder: ['column-1'],
};

export default initialData;