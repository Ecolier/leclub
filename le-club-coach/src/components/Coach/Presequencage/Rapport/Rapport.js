import React from 'react'
import { Icon } from 'antd'

export default (props) => {
  const { rapport } = props

  return (
    <div style={{ flex: 1 }}>
      {rapport && rapport.players && rapport.players.length > 0 && (
        <div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottom: 'solid 1px black', borderColor: 'black' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 1px black', borderColor: 'grey' }}>
              <p style={{ fontSize: 20, fontWeight: '600' }}>
                <Icon name={'ios-shirt'} style={{ color: 'black', fontSize: 25 }}/>
              </p>
            </div>
            <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 1px black', borderColor: 'black' }}>
              <p style={{ fontSize: 20, fontWeight: '600' }}>
                <Icon name={'check'} style={{ color: 'green', fontSize: 25 }}/>
                Gagné
              </p>
              <p>{Math.round(rapport.total.win * 100 / (rapport.total.win + rapport.total.lost)) || 0}%</p>
            </div>
            <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10 }}>
              <p style={{ fontSize: 20, fontWeight: '600' }}>
                <Icon name={'cross'} style={{ color: 'red', fontSize: 25 }}/>
                Perdu
              </p>
              <p>{Math.round(rapport.total.lost * 100 / (rapport.total.win + rapport.total.lost)) || 0}%</p>
            </div>
          </div>
          <div style={{ width: '100%' }}>
            {rapport.players.map(item => (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottom: 'solid 0.5px black', borderColor: 'grey' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                  <p style={{ fontSize: 18 }}>{item.numero}</p>
                </div>
                <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                  <p style={{ fontSize: 18 }}>{item.win}</p>
                </div>
                <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10 }}>
                  <p style={{ fontSize: 18 }}>{item.lost}</p>
                </div>
              </div>
            ))}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottom: 'solid 0.5px black', borderColor: 'grey', backgroundColor: '#EA178C' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p style={{ fontSize: 20, color: 'white' }}>Total</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p style={{ fontSize: 18, color: 'white' }}>{rapport.total.win}</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10 }}>
                <p style={{ fontSize: 18, color: 'white' }}>{rapport.total.lost}</p>
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottom: 'solid 0.5px black', borderColor: 'grey' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p>0-15</p>
                <p>min</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p style={{ fontSize: 18 }}>{rapport.time.first.win}</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10 }}>
                <p style={{ fontSize: 18 }}>{rapport.time.first.lost}</p>
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottom: 'solid 0.5px black', borderColor: 'grey' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p>15-30</p>
                <p>min</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p style={{ fontSize: 18 }}>{rapport.time.second.win}</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10 }}>
                <p style={{ fontSize: 18 }}>{rapport.time.second.lost}</p>
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottom: 'solid 0.5px black', borderColor: 'grey' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p>30-45</p>
                <p>min</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p style={{ fontSize: 18 }}>{rapport.time.third.win}</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10 }}>
                <p style={{ fontSize: 18 }}>{rapport.time.third.lost}</p>
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottom: 'solid 0.5px black', borderColor: 'grey' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p>45-60</p>
                <p>min</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p style={{ fontSize: 18 }}>{rapport.time.fourth.win}</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10 }}>
                <p style={{ fontSize: 18 }}>{rapport.time.fourth.lost}</p>
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottom: 'solid 0.5px black', borderColor: 'grey' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p>60-75</p>
                <p>min</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p style={{ fontSize: 18 }}>{rapport.time.fifth.win}</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10 }}>
                <p style={{ fontSize: 18 }}>{rapport.time.fifth.lost}</p>
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottom: 'solid 0.5px black', borderColor: 'grey' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p>75-90</p>
                <p>min</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10, borderRight: 'solid 0.5px black', borderColor: 'grey' }}>
                <p style={{ fontSize: 18 }}>{rapport.time.sixth.win}</p>
              </div>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', padding: 10 }}>
                <p style={{ fontSize: 18 }}>{rapport.time.sixth.lost}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
