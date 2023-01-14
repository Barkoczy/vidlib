/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import axios from 'axios';
import PeerTubeInterface from '../interfaces/PeerTube';

// @env
dotenv.config();

/**
 * @exports
 * @class PeerTube
 * @implements {PeerTubeInterface}
 */
export default class PeerTube implements PeerTubeInterface {
  protected domain;

  readonly filepath: string = path.resolve(process.cwd(), 'credentials.json');

  readonly defaultCredentials: object = {
    access_token: '',
    refresh_token: '',
    expires_in: 0,
    refresh_token_expires_in: 0,
  };

  /**
   * Constructor
   *
   * @param domain string
   */
  constructor(domain?: string | undefined) {
    this.domain =
      typeof domain === 'string' && domain.length !== 0
        ? domain
        : process.env.PEERTUBE_DOMAIN;
  }

  /**
   * @param videoId string
   * @returns object
   */
  public async video(videoId: string) {
    try {
      const res = await axios.get(
        `https://${this.domain}/api/v1/videos/${videoId}`
      );
      const res2 = await axios.get(
        `https://${this.domain}/api/v1/videos/${videoId}/description`
      );
      return { content: res2.data.description, ...res.data };
    } catch (error) {
      console.error(`PeerTube: ${error}`);
      return { error };
    }
  }

  /**
   * @param username string
   * @param include number|array
   * @param privacyOneOf number|array
   * @param count number
   * @param sort number
   * @returns object
   */
  public async feeds(
    username: string,
    include: any,
    privacyOneOf: any,
    count: number,
    sort: number
  ) {
    try {
      const params = {
        isLocal: true,
        isLive: false,
        nsfw: false,
        sort,
        include,
        privacyOneOf,
        count,
      };
      const res = await axios.get(
        `https://${this.domain}/api/v1/accounts/${username}/videos`,
        { params }
      );

      return {
        total: res.data.total,
        videos: res.data.data,
      };
    } catch (error) {
      console.error(`PeerTube: ${error}`);
      return {
        total: 0,
        videos: [],
      };
    }
  }

  /**
   * @param username string
   * @returns object
   */
  public async account(username: string) {
    try {
      const res = await axios.get(
        `https://${this.domain}/api/v1/accounts/${username}`
      );
      return res.data;
    } catch (error) {
      console.error(`PeerTube: ${error}`);
      return { error };
    }
  }

  /**
   * @param userId number
   * @returns object
   */
  public async user(userId: number) {
    try {
      const res = await axios.get(
        `https://${this.domain}/api/v1/users/${userId}`
      );
      return res.data;
    } catch (error) {
      console.error(`PeerTube: ${error}`);
      return { error };
    }
  }

  /**
   * @param username string
   * @param password string
   * @returns object
   */
  public async login(username: string, password: string) {
    try {
      const { client_id, client_secret } = await this.client();

      const {
        access_token,
        refresh_token,
        expires_in,
        refresh_token_expires_in,
      } = await this.tokenWithPassword(
        client_id,
        client_secret,
        username,
        password
      );

      // to miliseconds
      const expiresIn = expires_in * 1000;
      const refreshTokenExpiresIn = refresh_token_expires_in * 1000;

      // write credentials
      await this.writeCredentialsFile({
        access_token,
        refresh_token,
        expires_in: Date.now() + expiresIn,
        refresh_token_expires_in: Date.now() + refreshTokenExpiresIn,
      });

      // axios authorization
      this.setAxiosAuthorization(access_token);

      // user
      const account_data = await this.account(username);

      // response
      return {
        user: account_data,
        expiresIn,
      };
    } catch (error) {
      console.error(`PeerTube: ${error}`);
      return { error: 'Invalid login' };
    }
  }

  /**
   * @returns void
   */
  public async logout() {
    try {
      await this.writeCredentialsFile(this.defaultCredentials);
    } catch (error) {
      console.error(`PeerTube: ${error}`);
    }
  }

  /**
   * @param token string
   * @returns void
   */
  private async refresh(token: string) {
    try {
      const { client_id, client_secret } = await this.client();

      const {
        access_token,
        refresh_token,
        expires_in,
        refresh_token_expires_in,
      } = await this.tokenWithRefreshToken(client_id, client_secret, token);

      // to miliseconds
      const expiresIn = expires_in * 1000;
      const refreshTokenExpiresIn = refresh_token_expires_in * 1000;

      // write credentials
      await this.writeCredentialsFile({
        access_token,
        refresh_token,
        expires_in: Date.now() + expiresIn,
        refresh_token_expires_in: Date.now() + refreshTokenExpiresIn,
      });

      // axios authorization
      this.setAxiosAuthorization(access_token);
    } catch (error) {
      console.error(`PeerTube: ${error}`);
    }
  }

  /**
   * @returns object
   */
  private async client() {
    try {
      const res = await axios.get(
        `https://${this.domain}/api/v1/oauth-clients/local`
      );
      return res.data;
    } catch (error) {
      console.error(`PeerTube: ${error}`);
      return { error };
    }
  }

  /**
   * @param client_id string
   * @param client_secret string
   * @param username string
   * @param password string
   * @returns object
   */
  private async tokenWithPassword(
    client_id: string,
    client_secret: string,
    username: string,
    password: string
  ) {
    try {
      const params = new URLSearchParams({
        client_id,
        client_secret,
        grant_type: 'password',
        response_type: 'code',
        username,
        password,
      });

      const res = await axios.post(
        `https://${this.domain}/api/v1/users/token`,
        params
      );

      return res.data;
    } catch (error) {
      console.error(`PeerTube: ${error}`);
      return { error };
    }
  }

  /**
   * @param client_id string
   * @param client_secret string
   * @param refresh_token string
   * @returns object
   */
  private async tokenWithRefreshToken(
    client_id: string,
    client_secret: string,
    refresh_token: string
  ) {
    try {
      const params = new URLSearchParams({
        client_id,
        client_secret,
        grant_type: 'refresh_token',
        refresh_token,
      });

      const res = await axios.post(
        `https://${this.domain}/api/v1/users/token`,
        params
      );

      return res.data;
    } catch (error) {
      console.error(`PeerTube: ${error}`);
      return { error };
    }
  }

  /**
   * @returns void
   */
  public async auth() {
    try {
      // create if not exits
      const exists = await this.existsCredentialsFile();

      if (!exists) {
        await this.writeCredentialsFile(this.defaultCredentials);
      }

      // credentials
      const credentials = await this.readCredentialsFile();

      // verify
      if (credentials.expires_in === 0) return;

      if (Date.now() <= credentials.expires_in) {
        this.setAxiosAuthorization(credentials.access_token);
      } else if (Date.now() <= credentials.refresh_token_expires_in) {
        await this.refresh(credentials.refresh_token);
      } else {
        await this.writeCredentialsFile(credentials);
      }
    } catch (error) {
      console.error(`PeerTube: ${error}`);
    }
  }

  /**
   * @returns boolean
   */
  private async existsCredentialsFile() {
    try {
      await fs.access(this.filepath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * @param credentials object
   * @returns void
   */
  private async writeCredentialsFile(credentials: object) {
    await fs.writeFile(this.filepath, JSON.stringify(credentials));
  }

  /**
   * @returns object|null
   */
  private async readCredentialsFile() {
    try {
      const data: any = await fs.readFile(this.filepath);
      return JSON.parse(data);
    } catch (err) {
      console.error('Cannot read credentials file');
      return null;
    }
  }

  /**
   * @param token string
   * @returns void
   */
  // eslint-disable-next-line class-methods-use-this
  private setAxiosAuthorization(token: string) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}
