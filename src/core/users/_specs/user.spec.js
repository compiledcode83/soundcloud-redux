import { is, Record } from 'immutable';
import { createUser, User } from '../user';


describe('users', () => {
  describe('User', () => {
    let user;

    beforeEach(() => {
      user = new User();
    });

    it('should be an instance of Immutable.Record', () => {
      expect(user instanceof Record).toBe(true);
    });

    it('should contain default properties', () => {
      let user = new User();

      expect(user.avatarUrl).toBe(null);
      expect(user.city).toBe(null);
      expect(user.country).toBe(null);
      expect(user.followersCount).toBe(0);
      expect(user.followingsCount).toBe(0);
      expect(user.fullName).toBe(null);
      expect(user.id).toBe(null);
      expect(user.likesCount).toBe(0);
      expect(user.permalinkUrl).toBe(null);
      expect(user.playlistCount).toBe(0);
      expect(user.profile).toBe(false);
      expect(user.trackCount).toBe(0);
      expect(user.username).toBe(null);
    });


    describe('createUser() factory function', () => {
      it('should create User instance from provided user data', () => {
        let userData = {
          avatar_url: 'https://i1.sndcdn.com/avatars-000185787427-8n8dew-large.jpg',
          city: 'City Name',
          country: 'Country Name',
          followers_count: 21444,
          followings_count: 257,
          full_name: 'Full Name',
          id: 12396,
          permalink_url: 'https://soundcloud.com/user-${id}',
          playlist_count: 4,
          public_favorites_count: 64,
          track_count: 6,
          username: 'Username'
        };

        let expectedUser = new User({
          avatarUrl: userData.avatar_url,
          city: userData.city,
          country: userData.country,
          followersCount: 21444,
          followingsCount: userData.followings_count,
          fullName: userData.full_name,
          id: userData.id,
          likesCount: userData.public_favorites_count,
          permalinkUrl: userData.permalink_url,
          playlistCount: userData.playlist_count,
          profile: true,
          trackCount: userData.track_count,
          username: userData.username
        });

        expect(is(createUser(userData, true), expectedUser)).toBe(true);
      });
    });
  });
});
