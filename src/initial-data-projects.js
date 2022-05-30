const initialDataProjects = [
    {
        id: 'Column-1',
        title: ' 📃 Backlog',
        color: 'red',
        tasks: [
            {
                id: "Project 1",
                title: 'Sprotx',
                link: "sportx.lv",
                access: "sportx.lv",
                priority: "Very High",
                price: "7000$",
                startDate: "17.02.2022",
                endDate: "17.04.2022"    
            },
            {
                id: "Project 2",
                title: 'Amarina',
                link: "amarina.lv",
                access: "amarina.lv",
                priority: "High",
                price: "20000$",
                startDate: "12.01.2022",
                endDate: "15.03.2022"
            },
            {
                id: "Project 3",
                title: 'LYL',
                link: "lyl.eu",
                access: "lyl.eu",
                priority: "Medium",
                price: "3000$",
                startDate: "02.02.2022",
                endDate: "03.03.2022"
            },
        ]
    },
    {
        id: 'Column-2',
        title: ' ✏️ To Do',
        color: 'yellow',
        tasks: []
    },
    {
        id: 'Column-3',
        title: ' ✔️ In Progress',
        color: 'green',
        tasks: []
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

export default initialDataProjects;