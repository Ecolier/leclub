import React from 'react'
import { Card, Col, Row, Collapse } from 'antd'

export default (props) => {
  const { InCollapse, InVisible } = props

  return (
    <div>
      <Row gutter={[10, 10]} style={{ width: '100%', margin: '0' }}>
        {props.dataSource.map((data, index) => (
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} key={index}>
            <Card
              style={{ width: '100%' }}
              bodyStyle={{ padding: 0 }}
              actions={props.actions ? props.actions.map(action => {
                return (
                  <div onClick={() => { action.props.onActionClick && action.props.onActionClick(data) }}>
                    {action}
                  </div>
                )
              }) : []}
            >
              <Collapse bordered={false}>
                <Collapse.Panel
                  header={<InVisible data={data} />}
                  key={index}
                  style={{ border: 'none' }}
                >
                  <InCollapse data={data} />
                </Collapse.Panel>
              </Collapse>
            </Card>
          </Col>)
        )}
      </Row>

    </div>
  )
}
