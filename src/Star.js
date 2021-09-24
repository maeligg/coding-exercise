import StarFull from './assets/img/half-star-full.svg'
import StarEmpty from './assets/img/half-star-empty.svg'

const Star = ({full}) => {
    return <img className="star" alt="star" src={full ? StarFull : StarEmpty} />
}

export default Star;