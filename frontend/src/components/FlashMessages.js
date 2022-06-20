import React from "react"

function FlashMessages(props) {
  return (
    <div className="floating-alerts">
        {props.messages.map((msg, index) => {
            return (
                <div key={index} className="alert alert-success text-center floating-alert shadow-sm bg-[#5932EA] text-white px-10 py-4 rounded-xl">{msg}</div>
            )
        })}
    </div>
  )
}

export default FlashMessages