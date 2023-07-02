/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unknown-property */

import {useEffect, useState} from 'react'

import Cookies from 'js-cookie'

import Slider from 'react-slick'

import Loader from 'react-loader-spinner'

// eslint-disable-next-line import/no-extraneous-dependencies
import {useMediaQuery} from 'react-responsive'

import './index.css'

const SliderComponent = () => {
  const isSmallDevice = useMediaQuery({maxWidth: 576})
  const apiStatusConst = {
    initial: 'INITIAl',
    in_progress: 'IN_INPROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
  }

  const [apiStatus, setApiStatus] = useState({
    status: apiStatusConst.initial,
    storiesList: [],
    error: '',
  })

  const getStories = async () => {
    setApiStatus({status: apiStatusConst.in_progress})
    const apiUrl = 'https://apis.ccbp.in/insta-share/stories'
    const jwtToken = Cookies.get('jwt_token')
    // console.log(jwtToken)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.users_stories.map(each => ({
        userId: each.user_id,
        userName: each.user_name,
        storyUrl: each.story_url,
      }))
      setApiStatus({
        status: apiStatusConst.success,
        storiesList: updatedData,
        error: '',
      })
    } else {
      setApiStatus({status: apiStatusConst.failure})
    }
  }

  useEffect(() => {
    getStories()
  }, [])

  const renderSlickSliders = () => {
    const {storiesList} = apiStatus
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 2,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 3,
          },
        },
      ],
    }

    return (
      <ul className="slider-container">
        <Slider {...settings}>
          {storiesList.map(eachStory => (
            <li key={eachStory.userId}>
              <div className="story_container">
                <img
                  className="logo-image"
                  alt="user story"
                  src={eachStory.storyUrl}
                />
                <p className="user-story-name">
                  {isSmallDevice
                    ? eachStory.userName.split(' ')[0]
                    : eachStory.userName}
                </p>
              </div>
            </li>
          ))}
        </Slider>
      </ul>
    )
  }

  //
  const renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  const renderFailureView = () => (
    <div className="error-msg-container">
      <img
        src="https://res.cloudinary.com/dufyrxyey/image/upload/v1687498861/alert-triangle_ncn4yq.png"
        alt="failure view"
        className="error-img"
      />
      <p className="error-msg">Something went wrong. Please try again</p>
      <button
        type="button"
        className="error-button"
        onClick={() => getStories()}
      >
        Try again
      </button>
    </div>
  )

  const renderSwitchCase = () => {
    const {status} = apiStatus

    switch (status) {
      case apiStatusConst.success:
        return renderSlickSliders()
      case apiStatusConst.failure:
        return renderFailureView()
      case apiStatusConst.in_progress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return (
    <div className="slides">
      <div>{renderSwitchCase()}</div>
    </div>
  )
}
export default SliderComponent
