import StarFull from './assets/img/star-full.svg'
import StarEmpty from './assets/img/star-empty.svg'

const Star = ({full}) => {
    return <img className="star" alt="star" src={full ? StarFull : StarEmpty} />
}

export default Star;