import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserGroup, User, TableConfig, TablePage } from 'app/common/interfaces/mainflux.interface';
import { UsersService } from 'app/common/services/users/users.service';
import { UserGroupsService } from 'app/common/services/users/groups.service';
import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'ngx-user-groups-details-component',
  templateUrl: './user-groups.details.component.html',
  styleUrls: ['./user-groups.details.component.scss'],
})
export class UserGroupsDetailsComponent implements OnInit {

  memberTypes: string[] = ["users","things","channels"]
  selectedMemberType: string = "users";
  group: UserGroup = {};

  membersLoading: boolean = false ;

  membersPage: TablePage = {};
  unassignedPage: TablePage = {};
  toAssign: string[] = [];
  toUnassign: string[] = [];

  editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;

  usersTableConfig: TableConfig = {
    colNames: ['Email', 'ID', 'checkbox'],
    keys: ['email', 'id', 'checkbox'],
  };

  thingsTableConfig: TableConfig = {
    colNames: ['ID', 'Name', 'checkbox'],
    keys: ['id', 'name', 'checkbox'],
  };

  channelsTableConfig: TableConfig = {
    colNames: ['ID', 'Name', 'checkbox'],
    keys: ['id', 'name', 'checkbox'],
  };

  tableConfig: TableConfig = {}

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private userGroupsService: UserGroupsService,
    private thingsService: ThingsService,
    private channelsService: ChannelsService,
    private notificationsService: NotificationsService,
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.mainMenuBar = false;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.userGroupsService.getGroup(id).subscribe(
      (resp: any) => {
        this.group = resp;
        this.getMembers();
      },
    );
  }

  onChangeMemberType(event: any) {
    this.selectedMemberType=event;
    this.getMembers();
  }

  getMembers() {
    this.membersLoading = true;
    this.resetVariables();
    this.setTableConfig();
    this.setUnassignedMember();
    this.setAssignedMember();
    this.membersLoading = false;
  }


  setTableConfig() {
    switch (this.selectedMemberType) {
      case "users":
        this.tableConfig = this.usersTableConfig;
        return;
      case "things":
        this.tableConfig = this.thingsTableConfig;
      case "channels":
        this.tableConfig = this.channelsTableConfig;
    }
  }

  resetVariables() {
    this.unassignedPage = {};
    this.membersPage = {};
    this.toAssign = [];
    this.toUnassign = [];
    this.tableConfig = {}
  }

  setUnassignedMember() {
    switch (this.selectedMemberType) {
      case "users":
        this.getUsers();
        return;
      case "things":
        this.getThings();
        return;
      case "channels":
        this.getChannels();
        return;
    }
  }

  setAssignedMember() {
    this.userGroupsService.getMembersByType(this.group.id, this.selectedMemberType ).subscribe(
      resp => {
        switch (this.selectedMemberType) {
          case "users":
            this.membersPage.rows = resp.users;
            break;
          case "things":
            this.membersPage.rows = resp.things;
            break;
          case "channels":
            this.membersPage.rows = resp.channels;
            break;
        }
        this.membersPage.total = resp.total;
        this.membersPage.offset = resp.offset;
        this.membersPage.limit = resp.limit;

        if (this.membersPage.total > 0) {
          // Remove members from available Users
          this.membersPage.rows.forEach((m: any) => {
            this.unassignedPage.rows = this.unassignedPage.rows
            .filter((u: any) => u.id !== m.id) || [];
          });
          this.unassignedPage.total = this.unassignedPage.rows.length || 0
        }
      },
    );
  }

  onAssign() {
    this.userGroupsService.assignMembers(this.group.id, this.toAssign, this.selectedMemberType).subscribe(
      resp => {
        this.notificationsService.success(`Successfully assigned ${this.selectedMemberType}(s) to Group`, '');
        this.getMembers();
      },
    );

    if (this.toAssign.length === 0) {
      this.notificationsService.warn(`${this.selectedMemberType}(s) must be provided`, '');
    }
  }

  onUnassign() {
    this.userGroupsService.unassignMembers(this.group.id, this.toUnassign).subscribe(
      resp => {
        this.notificationsService.success(`Successfully unassigned ${this.selectedMemberType}(s) from Group`, '');
        this.getMembers();
      },
    );
  }

  onChangeLimitMembers(limit: number) {
    this.membersPage.offset = 0;
    this.membersPage.limit = limit;
    this.getMembers();
  }

  onChangePageMembers(offset: number) {
    this.membersPage.offset = offset;
    this.getMembers();
  }

  onChangeLimitUnassigned(limit: number) {
    this.unassignedPage.offset = 0;
    this.unassignedPage.limit = limit;
  }

  onChangePageUnassigned(offset: any) {
    this.unassignedPage.offset = offset;
  }

  onCheckboxUnassigned(rows: string[]) {
    this.toAssign = rows;
  }

  onCheckboxMembers(rows: string[]) {
    this.toUnassign = rows;
  }

  getUsers() {
    this.usersService.getUsers().subscribe(
      (resp: any) => {
        this.unassignedPage.rows = resp.users;
        this.unassignedPage.total = resp.total;
        this.unassignedPage.offset = resp.offset;
        this.unassignedPage.limit = resp.limit;
      },
    );
  }
  getThings() {
    this.thingsService.getThings({}).subscribe(
      (resp: any) => {
        this.unassignedPage.rows = resp.things;
        this.unassignedPage.total = resp.total;
        this.unassignedPage.offset = resp.offset;
        this.unassignedPage.limit = resp.limit;
      },
    );

  }

  getChannels() {
    this.channelsService.getChannels({}).subscribe(
      (resp: any) => {
        this.unassignedPage.rows = resp.channels;
        this.unassignedPage.total = resp.total;
        this.unassignedPage.offset = resp.offset;
        this.unassignedPage.limit = resp.limit;
      },
    );
  }

  onEdit() {
    try {
      this.group.metadata = this.editor.get();
    } catch (e) {
      this.notificationsService.error('Wrong metadata format', '');
      return;
    }

    this.userGroupsService.editGroup(this.group).subscribe(
      resp => {
        this.notificationsService.success('Group metadata successfully edited', '');
      },
    );
  }
}
