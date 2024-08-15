import React from 'react'
import ReactDOM from 'react-dom'

export default class extends React.PureComponent {

  componentDidMount () {
    this.subscribeScroll()
    this.innerEl = ReactDOM.findDOMNode(this)
  }

  componentDidUpdate (prevProps) {
    if (this.loadMore) {
      this.loadMore = false
      if (this.props.hasMore || prevProps.hasMore) {
        return setTimeout(() => this.subscribeScroll(), 100)
      }
    }
  }

  componentWillUnmount () {
    this.unsubscribeScroll()
  }

  subscribeScroll () {
    if (!this.scrollSubscribed) {
      this.scrollSubscribed = true
      window.addEventListener('scroll', this.handleScroll)
    }
  }

  unsubscribeScroll () {
    if (this.scrollSubscribed) {
      this.scrollSubscribed = false
      window.removeEventListener('scroll', this.handleScroll)
    }
  }

  currentPage = this.props.pageStart || 0

  handleScroll = () => {
    if (this.loadMore || !this.props.hasMore) {
      return false
    }
    const triggerY = this.innerEl.offsetTop + this.innerEl.offsetHeight - this.threshold
    const currentY = window.pageYOffset + window.innerHeight

    if (this.props.loadMore && currentY >= triggerY) {
      this.loadMore = true
      this.unsubscribeScroll()
      this.props.loadMore(this.currentPage++)
    }
  }

  get threshold () {
    return this.props.threshold || 250
  }

  render () {
    return React.createElement(React.Fragment, null, this.props.children)
  }

}
