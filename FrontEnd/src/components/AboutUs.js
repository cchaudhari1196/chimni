import './AboutUs.css'
import { Container } from 'react-bootstrap'
import { textAlign } from '@mui/system'

const About = () => {
  return (
    <Container className="aboutDiv">
      <div className="aboutHead">About Us</div>
      <div className="mt-4 aboutText" style={{ textAlign: 'center' }}>
        This might be the most distinctive website we’ve come across.<br></br> A
        team formed by CDAC graduates has developed this Portal. <br></br>
        To simplify the process of buying customized products such as Garments,
        Daily use home utilities such as bedsheet.
      </div>
    </Container>
  )
}
export default About
