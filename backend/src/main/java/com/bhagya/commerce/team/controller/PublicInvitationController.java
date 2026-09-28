package com.bhagya.commerce.team.controller;

import com.bhagya.commerce.team.dto.AcceptInvitationRequest;
import com.bhagya.commerce.team.dto.PublicInvitationData;
import com.bhagya.commerce.team.dto.TeamMemberDto;
import com.bhagya.commerce.team.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/invitations")
public class PublicInvitationController {

    private final TeamService teamService;

    public PublicInvitationController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/{token}")
    public ResponseEntity<PublicInvitationData> getInvitation(@PathVariable String token) {
        return ResponseEntity.ok(teamService.getPublicInvitation(token));
    }

    @PostMapping("/{token}/accept")
    public ResponseEntity<TeamMemberDto> acceptInvitation(
            @PathVariable String token,
            @RequestBody AcceptInvitationRequest req
    ) {
        return ResponseEntity.ok(teamService.acceptInvitation(token, req));
    }
}
