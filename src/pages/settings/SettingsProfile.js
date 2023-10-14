import React, { useEffect } from 'react'
import SettingsBase from './SettingsBase'
import { Box, Button, Grid } from '@mui/material'
import { Field, reduxForm } from 'redux-form';
import { FormField } from '../../components/common/FormField';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { requestProfileByUsername } from '../../slice/memberSlice';

const renderField = (field) => {
    return (
        <div>
            <FormField field={field} />
        </div>
    );
};

let SettingsProfile = (props, { submitting }) => {
    const currentUser = useSelector(() => {
        return JSON.parse(localStorage.getItem("currentUser"));
    });

    const userProfile = useSelector((state) => {
        console.log("useSelect userProfile", state.memberSlice.userProfile);
        return state.memberSlice.userProfile;
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getUserProfile = async () => {
        console.log("getUserProfile called");
        try {
            await dispatch(requestProfileByUsername(currentUser.username)).unwrap();
        } catch {
            alert("조회에 실패했습니다.");
            //navigate("/");
        }
    }

    useEffect(() => {
        console.log("useEffect called")
        if (currentUser.username != undefined) {
            getUserProfile();
        }
    }, []);

    // if (!userProfile) {
    //     return <div>Loading</div>
    // }

    return (
        <SettingsBase currentMenu={'profile'}>
            <Grid container>
                <Box sx={{ fontSize: 'h4.fontSize', fontWeight: 'regular' }}>
                    {currentUser.username}
                </Box>
            </Grid>
            <Box sx={{ mt: 0 }}></Box>
            <Grid container>
                <Grid item xs={7}>
                    <Box component="form" onSubmit={() => console.log("submit")} noValidate>
                        <Field
                            component={renderField}
                            name="introductionText"
                            label="한 줄 소개"
                            placeholder="간략한 소개를 적어주세요"
                            hintText="길지 않게 35자 이내로 입력해 주세요"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={submitting}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            수정하기
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={5}>
                    <Box sx={{ ml: 3 }}>
                    </Box>

                </Grid>
            </Grid>
        </SettingsBase >
    )
}

const mapStateToProps = (state) => {
    return { initialValues: state.memberSlice.userProfile }
}

SettingsProfile = reduxForm({ form: 'profileEditForm' })(SettingsProfile);
SettingsProfile = connect(mapStateToProps, null)(SettingsProfile);

export default SettingsProfile;