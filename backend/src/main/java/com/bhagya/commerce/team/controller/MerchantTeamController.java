package com.bhagya.commerce.team.controller;

import com.bhagya.commerce.team.dto.*;
import com.bhagya.commerce.team.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/merchant/team")
public class MerchantTeamController {

    private final TeamService teamService;

    public MerchantTeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<List<TeamMemberDto>> getTeamMembers(
            @RequestHeader(value = "X-Organization-Id", defaultValue = "org_varanasi_heritage") String orgId
    ) {
        return ResponseEntity.ok(teamService.getTeamMembers(orgId));
    }

    @PostMapping("/invite")
    public ResponseEntity<TeamInvitationDto> inviteMember(
            @RequestBody TeamInviteRequest req,
            @RequestHeader(value = "X-Organization-Id", defaultValue = "org_varanasi_heritage") String orgId,
            @RequestHeader(value = "X-User-Id", defaultValue = "usr_dev_merchant_01") String actorUserId
    ) {
        return ResponseEntity.ok(teamService.inviteMember(orgId, actorUserId, req));
    }

    @PatchMapping("/{memberId}")
    public ResponseEntity<TeamMemberDto> updateMember(
            @PathVariable String memberId,
            @RequestBody TeamMemberUpdateRequest req,
            @RequestHeader(value = "X-Organization-Id", defaultValue = "org_varanasi_heritage") String orgId,
            @RequestHeader(value = "X-User-Id", defaultValue = "usr_dev_merchant_01") String actorUserId
    ) {
        return ResponseEntity.ok(teamService.updateMember(orgId, actorUserId, memberId, req));
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable String memberId,
            @RequestHeader(value = "X-Organization-Id", defaultValue = "org_varanasi_heritage") String orgId,
            @RequestHeader(value = "X-User-Id", defaultValue = "usr_dev_merchant_01") String actorUserId
    ) {
        teamService.removeMember(orgId, actorUserId, memberId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/invitations")
    public ResponseEntity<List<TeamInvitationDto>> getInvitations(
            @RequestHeader(value = "X-Organization-Id", defaultValue = "org_varanasi_heritage") String orgId
    ) {
        return ResponseEntity.ok(teamService.getInvitations(orgId));
    }

    @DeleteMapping("/invitations/{invitationId}")
    public ResponseEntity<Void> revokeInvitation(
            @PathVariable String invitationId,
            @RequestHeader(value = "X-Organization-Id", defaultValue = "org_varanasi_heritage") String orgId,
            @RequestHeader(value = "X-User-Id", defaultValue = "usr_dev_merchant_01") String actorUserId
    ) {
        teamService.revokeInvitation(orgId, actorUserId, invitationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/roles")
    public ResponseEntity<List<RoleDefinitionDto>> getRoles() {
        return ResponseEntity.ok(teamService.getRoles());
    }
}
