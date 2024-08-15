import './section.scss'
import React from 'react'

class SheetSection extends React.PureComponent {
  render () {
    return (
      <div className='b-match-sheet-section'>
        <div className='b-match-sheet-section-title'>{ this.props.title }</div>
        { this.props.description && (
          <div className='b-match-sheet-section-description'>{ this.props.description }</div>
        )}
        <div className='b-match-sheet-section-inner'>
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default SheetSection
