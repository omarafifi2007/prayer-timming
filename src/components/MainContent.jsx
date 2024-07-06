import Grid from "@mui/material/Unstable_Grid2"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Prayer from "./Prayer";
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import { useEffect, useState } from "react";
import axios from 'axios';
import moment from 'moment';
import "moment/dist/locale/ar"
moment.locale('ar')

export default function MainContent() {

    const [nextPrayerIndex, setNextPrayerIndex] = useState(1);
    const [selectedCity, setSelectedCity] = useState({ displayName: 'القاهرة', apiName: 'Cairo' });
    const [today, setToday] = useState("");
    const [timings, setTimings] = useState({});
    const [remainingTime, setRemainingTime] = useState();

    const avilableCities = [
        {
            displayName: 'القاهرة',
            apiName: 'Cairo'
        },
        {
            displayName: 'الأسكندرية',
            apiName: 'Alexandria'
        },
        {
            displayName: 'الجيزة',
            apiName: 'Giza'
        },
        {
            displayName: 'العاصمة الجديدة',
            apiName: 'New Administrative Capital'
        }
    ];

    const PrayerArray = [
        { key: "Fajr", displayName: "الفجر" },
        { key: "Dhuhr", displayName: "الظهر" },
        { key: "Asr", displayName: "العصر" },
        { key: "Maghrib", displayName: "المغرب" },
        { key: "Isha", displayName: "العشاء" }
    ]
    const getTimings = async () => {
        const data = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=EGY&city=${selectedCity.apiName}`)
        setTimings(data.data.data.timings)
    }

    useEffect(() => {
        getTimings();

        const t = moment();
        setToday(t.format("MMM Do YYYY | h:mm"))
    }, [selectedCity]);

    useEffect(() => {
        let interval = setInterval(() => {
            setupCountDouwnTimer();
        }, 1000)
        return () => {
            clearInterval(interval);
        }
    }, [timings])

    const setupCountDouwnTimer = () => {
        const momentNow = moment();

        let PrayerIndex = 0;

        if (
            momentNow.isAfter(moment(timings.Fajr, "hh:mm")) &&
            momentNow.isBefore(moment(timings.Dhuhr, "hh:mm"))
        ) {
            PrayerIndex = 1;
        } else if (
            momentNow.isAfter(moment(timings.Dhuhr, "hh:mm")) &&
            momentNow.isBefore(moment(timings.Asr, "hh:mm"))
        ) {
            PrayerIndex = 2;
        } else if (
            momentNow.isAfter(moment(timings.Asr, "hh:mm")) &&
            momentNow.isBefore(moment(timings.Maghrib, "hh:mm"))
        ) {
            PrayerIndex = 3;
        } else if (
            momentNow.isAfter(moment(timings.Maghrib, "hh:mm")) &&
            momentNow.isBefore(moment(timings.Isha, "hh:mm"))
        ) {
            PrayerIndex = 4;
        } else {
            PrayerIndex = 1;
        }
        setNextPrayerIndex(PrayerIndex);

        const nextPrayerObject = PrayerArray[PrayerIndex];
        const nextPrayerTime = timings[nextPrayerObject.key];

        const remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);


        // console.log(remainingTime);

        const durationRemainingTime = moment.duration(remainingTime);

        setRemainingTime(`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`)

        console.log(
            durationRemainingTime.hours(),
            durationRemainingTime.minutes(),
            durationRemainingTime.seconds())

        console.log(momentNow.isBefore(moment(timings['Dhuhr'], "hh:mm")));
        console.log(nextPrayerTime);
    }

    const handleCityChange = (event) => {
        const cityObject = avilableCities.find((city) => {
            return city.apiName == event.target.value
        })
        console.log(event.target.value)
        setSelectedCity(cityObject)
    }


    return (
        <>
            <Grid container className="S">
                <Grid xs={6}>
                    <div>
                        <h3>{today}</h3>
                        <h2>{selectedCity.displayName}</h2>
                    </div>
                </Grid>

                <Grid xs={6}>
                    <div>
                        <h3>متبقي حتي صلاة {PrayerArray[nextPrayerIndex].displayName}</h3>
                        <h2>{remainingTime}</h2>
                    </div>
                </Grid>
            </Grid>

            <Divider style={{ borderColor: 'white', opacity: '0.1' }} />
            <Stack direction='row' className="Stack" justifyContent={'space-around'} style={{ marginTop: '50px' }}>
                <Prayer name={'الفجر'} time={timings.Fajr} image="https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2" />
                <Prayer name={'الظهر'} time={timings.Dhuhr} image="https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921" />
                <Prayer name={'العصر'} time={timings.Asr} image="https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf" />
                <Prayer name={'المغرب'} time={timings.Maghrib} image="https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5" />
                <Prayer name={'العشاء'} time={timings.Isha} image="https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d" />
            </Stack>

            <Stack direction="row" justifyContent={'center'} style={{ marginTop: "40px" }}>
                <FormControl style={{ width: "20%" }}>
                    <InputLabel id="demo-simple-select-label"><span style={{ color: "white" }}>القاهرة</span></InputLabel>
                    <Select style={{ color: 'white' }} labelId="demo-simple-select-label" id="demo-simple-select" label="Age" onChange={handleCityChange}>

                        {avilableCities.map((city, id) => {
                            return (
                                <MenuItem key={id} value={city.apiName}>{city.displayName}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Stack>
        </>
    )
}