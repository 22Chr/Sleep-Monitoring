import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../utilities/components/auth-context';
import HintsNavbar from '../../utilities/components/navbar/hints-navbar';
import './insights.css'

function Insights() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Verifica che l'utente sia loggato
    useEffect(() => {
        if (!user) {
            alert('You must be logged in to see the Insights');
            navigate('/');
        }
    }, [user, navigate]);

    return user ? (
        <div hints-page>
            <HintsNavbar />
            <h2 className='the-importance-of-sleep'>
                Sleep plays a vital role in good health and well-being throughout the life.<br/> In fact,
                during sleep the body works to support brain functions, helping our growth and
                development.<br/> Well sleeping is essential to our daily activities and to maintain us
                healthy!
            </h2>
            <div className='SQI-details'>
                <h1>Sleep Quality Index (SQI) details</h1>
                <li><b>80 - 100: </b>excellent sleep quality</li>
                <li><b>60 - 79: </b>good sleep quality, but improveable</li>
                <li><b>40 - 59: </b>poor sleep quality</li>
                <li><b>0 - 39: </b>really bad sleep quality</li>
            </div>
            <ul className="hints-list">
                <h1 className='hints-you-can-follow'>Some hints you can follow</h1>
                <li className="item"><b>Creating a sleep routine:</b> go to bed and wake up at the same time each day, including weekends</li>
                <li className="item"><b>Creating a comfortable sleep environment:</b> keep your bedroom cool, dark, and quiet</li>
                <li className="item"><b>Avoiding certain foods and drinks:</b> avoid large meals, caffeine, alcohol, and nicotine close to bedtime</li>
                <li className="item"><b>Exercising regularly:</b> regular physical activity can help you sleep better</li>
                <li className="item"><b>Managing worries:</b> try to resolve worries before bed</li>
                <li className="item"><b>Avoiding screens before going to bed:</b> limit use of light-emitting devices</li>
                <li className="item"><b>Using a supportive mattress and pillow:</b> a good mattress and pillow can help you avoid aches and pains</li>
                <li className="item"><b>Using comfortable bedding:</b> bedding that feels comfortable and helps maintain a comfortable temperature can help you sleep</li>
                <li className="item"><b>Avoiding clock watching:</b> put your alarm clock out of sight</li>
            </ul>
        </div>
    ) : null;
}

export default Insights;
