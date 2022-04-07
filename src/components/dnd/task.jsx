import React from 'react'

export default class Task extends React.Component {
    render() {
        return <div className="task-container bg-white rounded-xl p-4 mb-4">
            <div className="task-container-header flex justify-between">
                <h4 className="task-title">{this.props.task.title}</h4>
                <div className="task-priority">{this.props.task.priority}</div>
            </div>
            <div className="task-project text-[#B5B5B5]">{this.props.task.project}</div>
            <div className="task-container-body mt-7">
                <div className="task-body-head flex justify-between">
                    <div className="task-progress-title">Task progress</div>
                    <div className="progress-percent text-[#5932EA]">40%</div>
                </div>
                <div className="task-content text-[#5932EA]">####--------------</div>
            </div>
            <div className="task-container-footer flex justify-between">
                <div className="task-users">users pic</div>
                <div className="task-comments text-[#B5B5B5]">comments</div>
            </div>
        </div>
    }
}