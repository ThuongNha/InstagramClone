import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE } from '../constants/index'
import firebase from 'firebase'
import { enableExpoCliLogging } from 'expo/build/logs/Logs'

export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
                } else {
                    console.log('does not exist')
                }
            })
    })
}

export function fetchUserPosts() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                console.log(posts)
                dispatch({ type: USER_POSTS_STATE_CHANGE, posts })
            })
    })
}

export function fetchUserFollowing() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following })
                for(let i = 0; i < following.length; i++){
                    dispatch(fetchUsersData(following[i]));
                }
            })
    })
}

export function fetchUsersData(uid) {
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid)

        if (!found) {
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id;
                        dispatch({ type: USERS_DATA_STATE_CHANGE, user })
                        dispatch(fetchUsersFollowingPosts(user.id));
                    } else {
                        console.log('does not exist')
                    }
                })
        }
    })
}

export const fetchUsersFollowingPosts = (uid) => { // I just take the uid that is passed here
  return (dispatch, getState) => {
    firebase.firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
       
        const user = getState().usersDataState.users.find((el) => el.uid === uid); // this is where the uid is used
        const posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return {id, ...data, user};
        });
        console.log(posts)
        dispatch({type: USERS_POSTS_STATE_CHANGE, posts, uid});
        console.log(getState());
      })
      .catch((err) => console.log(err.message));
  };
};