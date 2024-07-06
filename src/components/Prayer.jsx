/* eslint-disable react/prop-types */
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


export default function Prayer({ name, time, image }) {
    return (
        <>
            <Card className='Card' style={{ width: '600px', margin: '10px' }}>
                <CardMedia sx={{ height: 200 }} image={image} />
                <CardContent>
                    <h2>
                        {name}
                    </h2>
                    <Typography variant="h2" style={{ display: 'flex', justifyContent: 'center' }} color="text.secondary">
                        {time}
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
}