import { IonContent, IonHeader, IonPage, IonToolbar, IonCard, IonInput, IonToast, IonCardContent, IonCardTitle, IonCardHeader, IonCardSubtitle } from '@ionic/react';
import React, { useState } from 'react';
import axios from 'axios'
import { InAppBrowser } from '@ionic-native/in-app-browser'  
import { closeCircleOutline } from 'ionicons/icons'

import './Home.css';

const Home: React.FC = () => {

  const [user, setUser] = useState<string>('')
  const [repos, setRepos] = useState<any>([])

  const [showToast, setShowToast] = useState<boolean>(false)

  function searchGithubUser() {
    axios.get(`https://api.github.com/users/${user}/repos`)
      .then(res => {
        if(res.data.length > 0) {
          setRepos(res.data)
          setUser('')
        } else { 
          setShowToast(true)
          setUser('')
          setRepos([])
        }
      })
      .catch(err => {
        setShowToast(true)
        setUser('')
        setRepos([])
      })
  }

  function viewRepo(url: string) {
    InAppBrowser.create(url, '_system')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonInput placeholder="Usuário do GitHub" onIonChange={e => setUser(e.detail.value!)} onIonBlur={searchGithubUser} value={user}/>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {repos.map((repo: any) => (
          <IonCard key={repo.id} onClick={e => viewRepo(repo.html_url)}>
            <IonCardHeader>
              <IonCardSubtitle>
                {repo.language}
              </IonCardSubtitle>
              <IonCardTitle>
                {repo.name}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {repo.description}
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Usuário não encontrado"
        position="bottom"
        duration={5000}
        color='danger'
        buttons={[
          {
            side: 'end',
            icon: closeCircleOutline,
            handler: () => { setShowToast(false) }
          }
        ]}
      />
    </IonPage>
  );
};

export default Home;
