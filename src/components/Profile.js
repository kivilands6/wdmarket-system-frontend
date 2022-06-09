import React, {useContext} from 'react'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

function Profile() {
    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

  return (
    <div>
        <button className="py-3 px-7 bg-[#5932EA] text-white rounded-xl" onClick={() => appDispatch({type: "logout"})}>logout</button>
        <div className="profile-info mt-10">
          <div class="flex">
            <div className="details mr-16">
              <h2 className="text-xl font-semibold border-b border-[#5932EA] w-fit">Details</h2>
              <div className="details-body mt-6 flex flex-wrap">
                <div className="name w-1/2 pr-5">
                  <div className="name-label font-semibold">
                    Name:
                  </div>
                  <div className="name-value text-[#9197B3]">
                    {appState.user.name}
                  </div>
                </div>
                <div className="surname w-1/2 pl-5">
                  <div className="surname-label font-semibold">
                    Surname:
                  </div>
                  <div className="surname-value text-[#9197B3]">
                    {appState.user.surname}
                  </div>
                </div>
                <div className="username w-1/2 mt-10 pr-5">
                  <div className="username-label font-semibold">
                    Username:
                  </div>
                  <div className="username-value text-[#9197B3]">
                    {appState.user.username}
                  </div>
                </div>
              </div>
            </div>
            <div className="contacts mr-16">
              <h2 className="text-xl font-semibold border-b border-[#5932EA] w-fit">Contacts</h2>
              <div className="details-body mt-6">
                <div className="email">
                  <div className="email-label font-semibold">
                    Email:
                  </div>
                  <div className="email-value text-[#9197B3]">
                    {appState.user.email}
                  </div>
                </div>
                <div className="phone mt-10">
                  <div className="phone-label font-semibold">
                    Phone:
                  </div>
                  <div className="phone-value text-[#9197B3]">
                    {appState.user.phone}
                  </div>
                </div>
                <div className="address mt-10">
                  <div className="address-label font-semibold">
                    Address:
                  </div>
                  <div className="address-value text-[#9197B3]">
                    {appState.user.address}
                  </div>
                </div>
              </div>
            </div>
            <div className="additional-information">
              <h2 className="text-xl font-semibold border-b border-[#5932EA] w-fit">Additional information</h2>
              <div className="additional-body mt-6">
                <div className="joined">
                  <div className="joined-label font-semibold">
                    Joined date:
                  </div>
                  <div className="joined-value text-[#9197B3]">
                    {appState.user.joinedDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Profile