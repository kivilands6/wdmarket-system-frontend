import React from 'react'
import Task from './task'

export default class Column extends React.Component {
    render() {
        return <div className="column-container w-1/5">
            <div className="column-container-head flex justify-between py-2 border-b-2 mb-7">
                <h3 className="column-title text-base">{this.props.column.title}</h3>
                <button className="add-new-btn text-sm text-[#8DA2BC]">Add new +</button>
            </div>
            <div className="task-list">
                {this.props.tasks.map(task => <Task key={task.id} task={task} />)}
            </div>
        </div>
    }
}