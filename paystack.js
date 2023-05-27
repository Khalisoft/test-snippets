const initializePayment = async (paymentData: any) => {
        const options = {
            method: 'post',
            url: `https://api.paystack.co/transaction/initialize`,
            headers: {
                Authorization: `Bearer ${ENV.testPaystackSecretKey}`,
                'Content-Type': 'application/json'
            },
            data: {
                "email": authCont?.user?.email,
                "amount": paymentData?.amount,
                "label": `${authCont?.user?.first_name} ${authCont?.user?.last_name}`,
                "callback_url": `https://your url/${params.pid}`
            }
        }

        const res = await Axios(options)
        if (res.data?.status) {
            setPendingPayment(paymentData?.amount)
            router.push(res.data?.data?.authorization_url)
        }

    }


    const verifyPayment = async (ref: any) => {
        setBookingState('verifying')

        const options = {
            method: 'get',
            url: `https://api.paystack.co/transaction/verify/${ref}`,
            headers: {
                Authorization: `Bearer ${ENV.testPaystackSecretKey}`,
                'Content-Type': 'application/json'
            },

        }

        const res = await Axios(options)

        // console.log(res.data)

        if (res.data?.status && res?.data?.data?.status === 'success' && res?.data?.data?.gateway_response === 'Successful') {
            if (res.data.data.amount === pendingPayment) {
                setBookingState('confirmed')
                setTimeout(() => {
                    router.push('/records?tab=bookings')
                }, 1000);
            }else{
                alert('Wrong payment')
                setBookingState('verify')
            }
        }
    }
