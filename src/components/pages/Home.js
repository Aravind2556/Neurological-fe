import React from 'react'
import { MotorTest } from './MotorTest';
import { FieldFiveTest } from './FieldFiveTest';
import EyeTrackingMotorTest from './EyeTrackingMotorTest ';

function Home() {
  return (
    <div className="mx-auto px-4 py-4 space-y-6">
      <MotorTest />
      <FieldFiveTest />
      <EyeTrackingMotorTest />
    </div>

  );
}
export default Home


