import React from 'react'

export default (props) => {
  let prevent = false

  const doSimpleClick = () => {
    if (props.onClick) {
      props.onClick()
    }
  }

  const doDoubleClick = () => {
    if (props.onDoubleClick) {
      props.onDoubleClick()
    }
  }

  const handleClick = () => {
    if (prevent) {
      doDoubleClick()
      prevent = false
    } else {
      prevent = true
      setTimeout(() => {
        if (prevent) {
          doSimpleClick()
        }
        prevent = false
      }, 300)
    }
  }

  return (
    <div onClick={handleClick} style={{ ...props.style }}>
      {props.children}
    </div>
  )
}
