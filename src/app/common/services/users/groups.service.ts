import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

import { environment } from 'environments/environment';
import { UserGroup } from 'app/common/interfaces/mainflux.interface';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

const defLimit: number = 20;

@Injectable()
export class UserGroupsService {

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService,
  ) { }

  addGroup(org: UserGroup) {
    return this.http.post(environment.groupsUrl, org, { observe: 'response' })
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to create User Group',
            `Error: ${err.status} - ${err.statusText}`);
          return throwError(err);
        },
      );
  }

  editGroup(org: UserGroup) {
    return this.http.put(`${environment.groupsUrl}/${org.id}`, org)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to edit User Group',
            `Error: ${err.status} - ${err.statusText}`);
          return throwError(err);
        },
      );
  }

  deleteGroup(orgID: string) {
    return this.http.delete(`${environment.groupsUrl}/${orgID}`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to delete User Group',
            `Error: ${err.status} - ${err.statusText}`);
          return throwError(err);
        },
      );
  }

  unassignThings(groupID: string, userIDs: string[]): any {
    const unassignReq = {
      members: userIDs,
    };
    return this.http.request('delete', `${environment.groupsUrl}/${groupID}/members`, {body: unassignReq})
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to Unassing User from Group',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  assignThings(groupID: string, userIDs: string[]): any {
    const assignReq = {
      members: userIDs,
      type: 'things',
    };
    return this.http.post(`${environment.groupsUrl}/${groupID}/members`, assignReq)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to Assign things to Group',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  unassignChannels(groupID: string, userIDs: string[]): any {
    const unassignReq = {
      members: userIDs,
    };
    return this.http.request('delete', `${environment.groupsUrl}/${groupID}/members`, {body: unassignReq})
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to Unassing User from Group',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  assignChannels(groupID: string, userIDs: string[]): any {
    const assignReq = {
      members: userIDs,
      type: 'channels',
    };
    return this.http.post(`${environment.groupsUrl}/${groupID}/members`, assignReq)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to Assign channels to Group',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  assignMembers(groupID: string, memberIDs: string[], memberType: string): any {
    const assignReq = {
      members: memberIDs,
      type: memberType,
    };
    return this.http.post(`${environment.groupsUrl}/${groupID}/members`, assignReq)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to Assing User to Group',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  assignUser(groupID: string, userIDs: string[]): any {
    const assignReq = {
      members: userIDs,
      type: 'users',
    };
    return this.http.post(`${environment.groupsUrl}/${groupID}/members`, assignReq)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to Assing User to Group',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  unassignUser(groupID: string, userIDs: string[]): any {
    const unassignReq = {
      members: userIDs,
    };
    return this.http.request('delete', `${environment.groupsUrl}/${groupID}/members`, {body: unassignReq})
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to Unassing User from Group',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }
  unassignMembers(groupID: string, memberIDs: string[]): any {
    const unassignReq = {
      members: memberIDs,
    };
    return this.http.request('delete', `${environment.groupsUrl}/${groupID}/members`, {body: unassignReq})
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to Unassing User from Group',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }


  getGroup(groupID: string): any {
    return this.http.get(`${environment.groupsUrl}/${groupID}`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch User Group',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  getGroups(offset?: number, limit?: number, name?: string): any {
    offset = offset || 0;
    limit = limit || defLimit;

    let params = new HttpParams()
      .set('offset', offset.toString())
      .set('level', '5')
      .set('limit', limit.toString());

    if (name) {
      params = params.append('name', name);
    }

    return this.http.get(environment.groupsUrl, { params })
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch Users Groups',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  getMembersByType(groupID?: string, memberType?: string): any {
    switch (memberType) {
      case 'users':
        return this.getMembers(groupID);
      case 'things':
        return this.getThings(groupID);
      case 'channels':
        return this.getChannels(groupID);
    }
  }
  getMembers(groupID?: string): any {
    return this.http.get(`${environment.groupsUrl}/users/${groupID}`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch Group members',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  getThings(groupID?: string): any {
    return this.http.get(`${environment.groupsUrl}/things/${groupID}`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch Group things',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  getChannels(groupID?: string): any {
    return this.http.get(`${environment.groupsUrl}/channels/${groupID}`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch Group channels',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }
}
