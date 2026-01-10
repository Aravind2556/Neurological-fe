import React from 'react'

import Cognitive from './Cognitive'
import Speech from './Speech'
import { MotorTest } from './MotorTest'
import { FieldFiveTest } from './FieldFiveTest'
// import EyeTrackingMotorTest from './EyeTrackingMotorTest'
import TimedBallTest from './TimeBallTest'

export const Home = () => {
  return (
    <div className='md:px-40'>
      <MotorTest />
      <Speech />
      <Cognitive />
      
      
      <FieldFiveTest />
      <TimedBallTest />
    </div>
  )
}
